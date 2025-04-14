varying vec3 vPosition;
varying vec2 vUv;

uniform vec3 redColor;
uniform vec3 baseColor;
uniform float shouldBeRed;
uniform sampler2D uTexture;

float colorDistance(vec3 a, vec3 b) {
    return length(a - b);
}

void main() {
    vec4 tex = texture2D(uTexture, vUv);

    if (tex.r < 0.1 && tex.g < 0.1 && tex.b < 0.1) {
        discard;
    }

    vec3 redBorder = vec3(0.8, 0.0, 0.0);
    vec3 color = mix(baseColor, redColor, shouldBeRed);
    vec3 borderColor = mix(vec3(1.0), redBorder, shouldBeRed);

    vec3 targetGreen = vec3(0.0, 1.0, 0.0); // using the green channel to render the border
    float greenThreshold = 0.6;
    if (colorDistance(tex.rgb, targetGreen) < greenThreshold) {
        gl_FragColor = vec4(borderColor, .8);
        return;
    }

    float dist = distance(vUv, vec2(0.5));
    float fade = smoothstep(0.8, 0.0, dist);
    vec3 finalColor = mix(color, color * 5.0, fade);

    gl_FragColor = vec4(finalColor, 0.8);
}
