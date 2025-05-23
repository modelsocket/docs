import "./App.css";
import Home from "./home.mdx";
import Toc from "../build/home.toc.md";
import RobotLogo from "../static/robot.svg";
import { DiscordLogo, GitHubLogo } from "../components/logos";

const Hero = () => {
  return (
    <div className="w-full flex items-center space-x-2">
      <img
        src={RobotLogo}
        alt="Robot Logo"
        className="w-30 h-30 md:w-48 md:h-48"
      />
      <div className="text-4xl font-bold text-gray-700">
        ModelSocket
        <div className="text-gray-400 text-[16px] mt-1">V0 (draft)</div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col pt-8 pb-32 max-w-2xl w-full">
        <div className="flex pr-10 space-x-4">
          <div className="flex-1"></div>
          <div>
            <a target="_blank" href="https://github.com/modelsocket">
              <GitHubLogo className="fill-gray-300 hover:fill-gray-400 w-6 h-6" />
            </a>
          </div>

          <div>
            <a target="_blank" href="https://discord.gg/3UEk9rmBJX">
              <DiscordLogo className="fill-gray-300 hover:fill-gray-400 w-6 h-6" />
            </a>
          </div>
        </div>
        <div>
          <Hero />
        </div>
        <div className="flex flex-col">
          <div className="toc prose w-full px-4 pt-10">
            <h3>Table of Contents</h3>
            <Toc />
          </div>

          <main className="prose prose-slate pt-8 px-4 max-w-full">
            <Home />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
