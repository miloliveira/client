import React from "react";
import {
  LocationIcon,
  InnerAboutSectionComponent,
} from "../styles/profile.styles";
const Location = (props) => {
  const { location } = props;
  return (
    <InnerAboutSectionComponent>
      <LocationIcon />
      <p>{location}</p>
    </InnerAboutSectionComponent>
  );
};

export default Location;
