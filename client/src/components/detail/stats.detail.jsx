import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const statsStyles = {
  height: "auto",
  overflowY: "auto",
  margin: 16,
  marginRight: 0,
  zIndex: 1,
  boxShadow: "0 0 4px #777",
  backgroundColor: "#eee"
};

const headers = [
  "Aircraft",
  "Reg",
  "Route",
  "Meal",
  "Production",
  "Extra Catering",
  "Note"
];

const DetailStats = ({ item }) =>
  item && (
    <div style={statsStyles}>
      {item && (
        <List dense={true}>
          {headers.map(k => (
            <ListItem key={k}>
              <ListItemText primary={<b>{k}</b>} secondary={item[k] || "---"} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );

export default DetailStats;
