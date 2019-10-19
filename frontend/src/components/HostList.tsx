
import React from "react";
import { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { HostsApi } from "../api/HostsApi";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import { List, makeStyles, Paper, Typography, Divider, Chip } from "@material-ui/core";
import { ParsedTableHost } from "../api/ParsedTableHost";

export interface Props {
  hostsApi: HostsApi;
  // addresses: string[];
}

interface State {
  addresses: string[];
  displayedHost: ParsedTableHost;
}

export class HostList extends Component<Props, State> {
  private hostsApi: HostsApi;

  constructor(props: Props) {
    super(props);
    this.hostsApi = props.hostsApi
    this.state = {
      addresses: ['1', '2'],
      displayedHost: {
        address: '12345',
        status: 'ok',
        scanStart: 0,
        hostnames: [],
        ports: [],
      }
    };
  }


  async componentDidMount() {
    this.setState({
      addresses: await this.hostsApi.getAllAddresses()
    })
  }

  async changeDisplayedHost(address: string) {
    const newHost = await this.hostsApi.getHost(address)
    this.setState({ displayedHost: newHost })
  }

  getHostnamesListItems() {
    return this.state.displayedHost.hostnames.length > 0
      ? this.state.displayedHost.hostnames.map((hostname) => {
        return (
          <ListItem key={hostname}>
            <ListItemText primary={hostname} />
          </ListItem>
        )
      })
      : ['(none)']
  }

  getPortSummary() {
    return this.state.displayedHost.ports.length > 0
      ? this.state.displayedHost.ports.map((port) => {
        let color: "default" | "inherit" | "secondary" | "primary" | undefined;
        switch (port.state) {
          case 'open':
            color = 'secondary'
            break;
          case 'closed':
            color = 'primary'
            break;
          default:
            color = 'default'
            break;
        }
        return (
          <ListItem key={port.number}>
            <Chip
              size="small"
              label={`${port.service}(${port.protocol} port ${port.number}) is ${port.state}`}
              color={color}
            />
          </ListItem>
        )
      })
      : [
        <Chip
          size="small"
          label="None reported"
        />
      ]
  }

  getHostSummary() {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Typography variant="h3" component="h3">
            {this.state.displayedHost.address}
          </Typography>
          <Divider />
        </Grid>

        <Grid item>
          <Chip label={`Host status ${this.state.displayedHost.status} as of ${(new Date(this.state.displayedHost.scanStart)).toLocaleString()}`} />
        </Grid>

        <Grid item>
          <Typography variant="h5">
            Known Hostnames
        </Typography>
          <List dense>
            {this.getHostnamesListItems()}
          </List>
        </Grid>

        <Grid item>
          <Typography variant="h5">
            Port Summary
        </Typography>
          <List dense>
            {this.getPortSummary()}
          </List>
        </Grid>

      </Grid>
    );
  }

  render(): JSX.Element {
    const listItems = this.state.addresses.map((address) => {
      return (
        <ListItem
          key={address}
          selected={this.state.displayedHost.address === address}
          onClick={event => this.changeDisplayedHost(address)}
        >
          <ListItemAvatar>
            <Avatar>
              <DesktopWindowsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={address} />
        </ListItem>
      );
    })
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        spacing={5}
      >
        <Grid item xs={2}>
          <List>
            {listItems}
          </List>
        </Grid>
        <Grid item xs={4}>
          <Paper>
            {this.getHostSummary()}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
