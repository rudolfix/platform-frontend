import { mount } from "enzyme";
import * as React from "react";
import { tid } from "../../../test/testUtils";
import { PeopleSwiperWidgeLayout } from "./PeopleSwiperWidget";
import Container from "reactstrap/lib/Container";
import path from "path";
import fs from "fs";
describe("PeopleSwiperWidgeLayout tests", () => {
  const people = [
    {
      image:
        "https://documents.neufund.io/0xA443d169CCF4a1Bb955e8756205d8DB288061731/a96cd71a-7212-4d1a-9f85-315a9ad44039.jpg",
      name: "Arjun Umesha1",
      socialChannels: [
        {
          type: "medium",
          url: "",
        },
        {
          type: "twitter",
          url: "",
        },
        {
          type: "linkedin",
          url: "",
        },
      ],
    },
    {
      image:
        "https://documents.neufund.io/0xA443d169CCF4a1Bb955e8756205d8DB288061731/e98fccf4-07dd-4056-a3a9-3a16e0f6a042.jpg",
      name: "Arjun Umesha2",
      socialChannels: [
        {
          type: "medium",
          url: "",
        },
        {
          type: "twitter",
          url: "",
        },
        {
          type: "linkedin",
          url: "",
        },
      ],
    },
    {
      image:
        "https://documents.neufund.io/0xA443d169CCF4a1Bb955e8756205d8DB288061731/79cd3915-da03-487a-a9be-103a71123bcc.jpg",
      name: "Arjun Umesha3",
      socialChannels: [
        {
          type: "medium",
          url: "",
        },
        {
          type: "twitter",
          url: "",
        },
        {
          type: "linkedin",
          url: "",
        },
      ],
    },
    {
      image:
        "https://documents.neufund.io/0xA443d169CCF4a1Bb955e8756205d8DB288061731/97ff9edc-13ee-4dad-aa13-157a6a27de9d.jpg",
      name: "Arjun Umesha4",
      socialChannels: [
        {
          type: "medium",
          url: "",
        },
        {
          type: "twitter",
          url: "",
        },
        {
          type: "linkedin",
          url: "",
        },
      ],
    },
    {
      image:
        "https://documents.neufund.io/0xA443d169CCF4a1Bb955e8756205d8DB288061731/65738a5d-07e9-4444-ab82-6a7a4fca24bf.png",
      name: "Arjun Umesha5",
      socialChannels: [
        {
          type: "medium",
          url: "",
        },
        {
          type: "twitter",
          url: "",
        },
        {
          type: "linkedin",
          url: "",
        },
      ],
    },
    {
      image:
        "https://documents.neufund.io/0xA443d169CCF4a1Bb955e8756205d8DB288061731/e5e42b70-7142-4282-8b5b-d256d4ea6107.png",
      name: "Arjun Umesha6",
      socialChannels: [
        {
          type: "medium",
          url: "",
        },
        {
          type: "twitter",
          url: "",
        },
        {
          type: "linkedin",
          url: "",
        },
      ],
    },
  ];

  it("should ", () => {
    const div = document.createElement("div");
    div.style.width = "1156px";
    const wrapper = mount(
      <div style={{ width: "1156px", height: "50px" }} id="apple">
        <PeopleSwiperWidgeLayout people={people} showPersonModal={f => f} />
      </div>,
    );
    wrapper
      .find("button" + tid("people-swiper-widget.next"))
      .props()
      .onClick();
    wrapper.update();

    console.log(wrapper.find("PeopleSwiperWidgeLayout").state());
    // console.log(wrapper.debug());
  });
});
