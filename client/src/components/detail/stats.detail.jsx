import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { ListItemSecondaryAction, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  statsStyles: {
    height: "auto",
    overflowY: "auto",
    width: "calc(100vw / 5)",
    minWidth: 300,
    marginRight: theme.spacing.unit * 2,
    zIndex: 1,
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },

  noteStyles: {
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    fontFamily: "monospace",
    textAlign: "justify",
    fontSize: "1.1em",
    whiteSpace: "pre-wrap"
  }
});

const headers = [
  "Aircraft",
  "Reg",
  "Route",
  "Meal",
  "Production",
  "Extra Catering"
  // "Note"
];

const DetailStats = ({ item, classes }) => (
  <Paper className={classes.statsStyles}>
    {item && (
      <List dense={true}>
        {headers.map((k, index) => (
          <Fragment key={k}>
            <ListItem>
              <ListItemText
                primary={<Typography variant="caption">{k}</Typography>}
              />
              <ListItemSecondaryAction>
                <Typography variant="subheading">{item[k] || ""}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
            {index % 3 === 2 && <Divider inset component="li" />}
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
        <div className={classes.noteStyles}>{item["Note"]}</div>
      </List>
    )}
  </Paper>
);

export default withStyles(styles, { withTheme: true })(DetailStats);
