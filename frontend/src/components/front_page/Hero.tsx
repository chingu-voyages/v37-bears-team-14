import { Link } from "react-router-dom";
import ConnectionIllustration from "../illustrations/ConnectionIllustration";

const Hero = () => {
  return (
    <div className="h-100 md:h-80 overflow-y-hidden">
      <div className="relative mx-10 md:mx-0 top-10 md:top-4 text-center md:text-left md:w-1/2 text-4xl font-bold z-10">
        Find projects that fit your tech stack.
      </div>
      <div className="relative my-2 mx-10 md:mx-0 top-10 md:top-4 text-center md:text-left md:w-1/2 text-xl z-10">
        StackCafe is the stack-driven developer platform that matches your tech
        stacks with project tech stacks.
      </div>
      <div className="relative top-16 md:top-10 text-center md:text-left z-10">
        <Link className="main-btn px-16" to="/projects">
          Browse Projects
        </Link>
      </div>
      <div className="relative top-28 md:top-[-8rem] md:right-0 md:text-right text-center">
        <ConnectionIllustration className="inline-block h-80" />
      </div>
    </div>
  );
};

export default Hero;
