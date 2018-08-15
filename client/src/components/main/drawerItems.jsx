import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import Loop from "@material-ui/icons/Loop";
// import Help from "@material-ui/icons/Help";
import Today from "@material-ui/icons/Today";
// import Logout from "@material-ui/icons/ExitToApp";
// import Feedback from "@material-ui/icons/Feedback";
import InsertChart from "@material-ui/icons/InsertChart";
import { Link } from "react-router-dom";

export const mainItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <Link to="/app/detail">
          <Today />
        </Link>
      </ListItemIcon>
      <ListItemText primary="Day detail" />
    </ListItem>
    {/* <ListItem button>
      <ListItemIcon>
        <Loop />
      </ListItemIcon>
      <ListItemText primary="Rotations" />
    </ListItem> */}
    <ListItem button>
      <ListItemIcon>
        <Link to="/app/chart">
          <InsertChart />
        </Link>
      </ListItemIcon>
      <ListItemText primary="Aggregations" />
    </ListItem>
  </div>
);

export const otherItems = (
  <div>
    {/* <ListItem button>
      <ListItemIcon>
        <Help />
      </ListItemIcon>
      <ListItemText primary="Help" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Feedback />
      </ListItemIcon>
      <ListItemText primary="Feedback" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Logout />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem> */}
  </div>
);
