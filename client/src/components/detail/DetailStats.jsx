import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const statsStyles = {
  height: "calc(100vh - 132px)",
  overflowY: "auto",
  margin: 16,
  marginRight: 0,
  zIndex: 1,
  boxShadow: "0 0 4px #777",
  backgroundColor: '#eee'
};

const DetailStats = ({ item }) => (
  <div style={statsStyles}>
    {item && (
      <List dense={true}>
        {Object.keys(item).map(k => (
          <ListItem key={k}>
            <ListItemText primary={k} secondary={item[k]} />
          </ListItem>
        ))}
      </List>
    )}
  </div>
);

export default DetailStats;
