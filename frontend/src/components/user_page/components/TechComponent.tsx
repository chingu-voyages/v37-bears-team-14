import React from "react";

interface Props {
  changeTech: () => void;
  username: String;
}

export class TechComponent extends React.Component<Props> {
  render() {
    return (
      <button className="w-full">
        <div
          className="bg-gray-100 px-8 py-6 flex items-center border-b border-gray-300"
          onClick={(e) => this.props.changeTech()}
        >
          <div className="flex ml-4">
            <img
              src="https://nodejs.org/static/images/logo-hexagon-card.png"
              className="w-10 h-10 object-cover rounded object-top"
            />
            <div className="flex flex-col pl-4">
              <h2 className="font-medium text-2xl">{this.props.username}</h2>
            </div>
          </div>
        </div>
      </button>
    );
  }
}
