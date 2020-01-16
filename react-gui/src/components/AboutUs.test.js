import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AboutUs from "./AboutUs";
import { Link } from "react-router-dom";

configure({ adapter: new Adapter() });

describe("AboutUs.js", () => {
  it("should render always a link", () => {
    const wrapper = shallow(<AboutUs />);
    expect(wrapper.find(Link)).toHaveLength(1);
  });
});
