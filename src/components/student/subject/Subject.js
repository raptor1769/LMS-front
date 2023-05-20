import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

import "./Subject.scss";
import Recordings from "./recordings/Recordings";
import Assignments from "./assignments/Assignments";

const Subject = ({ subject }) => {
  const [key, setKey] = useState("videos");
  return (
    <div className="subject-page-container">
      <div className="subject-details">
        <div className="subject-name">{subject?.name}</div>
        <div className="subject-grade">{subject?.gradeDetails}</div>
        <div className="subject-grade">
          Prof : <strong>{subject?.teacher?.name}</strong>
        </div>
      </div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 tabs-container"
      >
        <Tab eventKey="videos" title="Videos">
          <Recordings subject={subject} />
        </Tab>
        <Tab eventKey="assignments" title="Assignments">
          <Assignments subject={subject} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Subject;
