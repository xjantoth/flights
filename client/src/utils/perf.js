import React, { unstable_Profiler as Profiler } from "react";

export default label => component =>
  process.env.NODE_ENV === "production" ? (
    component
  ) : (
    <Profiler
      id={label}
      onRender={(id, phase, actualTime, baseTime) =>
        console.table({
          performance: { component: id, phase: phase, time: actualTime }
        })
      }
    >
      {component}
    </Profiler>
  );
