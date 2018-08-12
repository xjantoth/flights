import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ListItemSecondaryAction, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

const statsStyles = {
  height: "auto",
  overflowY: "auto",
  width: "calc(100vw / 5)",
  minWidth: 300,
  marginRight: 16,
  zIndex: 1,
  paddingTop: 16,
  paddingRight: 16
};

const noteStyles = {
  paddingLeft: 24,
  marginTop: 24,
  fontFamily: "monospace",
  textAlign: "justify",
  fontSize: "1.2em"
};

const headers = [
  "Aircraft",
  "Reg",
  "Route",
  "Meal",
  "Production",
  "Extra Catering"
  // "Note"
];

const DetailStats = ({ item }) => (
  <Paper style={statsStyles}>
    {item && (
      <List dense={true}>
        {headers.map((k, index) => (
          <Fragment key={k}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    style={{ fontWeight: "bold" }}
                    variant="subheading"
                  >
                    {k}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <Typography variant="body1">{item[k] || "---"}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
            {index % 3 == 2 && <Divider inset component="li" />}
          </Fragment>
        ))}
        <ListItem>
          <ListItemText
            primary={
              <Typography style={{ fontWeight: "bold" }} variant="subheading">
                Note
              </Typography>
            }
          />
          {/* <ListItemSecondaryAction> */}
          {/* <Typography variant="body1">{item["Note"] || "---"}</Typography> */}
          {/* </ListItemSecondaryAction> */}
        </ListItem>
        <div style={noteStyles}>{item["Note"]}</div>
      </List>
    )}
  </Paper>
);

export default DetailStats;
