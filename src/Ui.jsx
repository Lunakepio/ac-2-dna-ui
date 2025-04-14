import { useGSAP } from "@gsap/react";
import { useDNAStore } from "./store/store";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export const Ui = () => {
  const { hoveredSequence, selectedIndex, selectedSequence } = useDNAStore();
  const memoryRef = useRef(null);
  const spanRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      new SplitType(titleRef.current, { types: "words, chars" });
    }
  }, []);

  useGSAP(() => {
    const chars = titleRef.current?.querySelectorAll(".char");
    

    if (chars) {
      gsap.fromTo(
        chars,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          stagger: {
            amount: 0.3,
            from: "random",
            ease: "linear",
          },
          duration: 0.2,
        }
      );
    }
  }, [hoveredSequence]);
  
  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.innerHTML = hoveredSequence;
    }
  }, [hoveredSequence, selectedIndex]);

  useGSAP(() => {
    if (memoryRef.current) {
      if (selectedSequence) {
        gsap.to(memoryRef.current, {
          duration: 0.4,
          opacity: 1,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(memoryRef.current, {
          duration: 0.4,
          opacity: 0,
          ease: "power2.inOut",
        });
      }
    }
  }, [selectedSequence]);

  return (
    <div className="ui-container">
      <div className="titles">
        <h1 className="title" ref={titleRef}>
          SEQUENCE
        </h1>
        <h1 className="title title-2">
          {hoveredSequence}
        </h1></div>
      <div className="bottom">
        <div className="red">
          <div className="plane">
            <div className="micro-plane"></div>
          </div>
        </div>
        <div className="memory" ref={memoryRef}>
          MEMORY {selectedIndex}
        </div>
      </div>
    </div>
  );
};
