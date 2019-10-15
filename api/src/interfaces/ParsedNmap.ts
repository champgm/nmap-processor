export interface ParsedNmap {
  nmaprun: {
    host: NmapHost,
  };
}

export interface NmapHost {
  $: {
    starttime: string,
    endtime: string,
  };
  status: {
    $: {
      state: string,
      reason: string,
      reason_ttl: string,
    },
  }[];
  address:
    {
      $: {
        addr: string,
        addrtype: string,
      },
    }
  [];
  hostnames:
    {
      hostname:
        {
          $: {
            name: string,
            type: string,
          },
        }
      [],
    }
  [];
  ports: [
    {
      port: [
        {
          $: {
            protocol: string,
            portid: string,
          },
          state: [
            {
              $: {
                state: string,
                reason: string,
                reason_ttl: string,
              },
            }
          ],
          service: [
            {
              $: {
                name: string,
                method: string,
                conf: string,
              },
            }
          ],
        },
        {
          $: {
            protocol: string,
            portid: string,
          },
          state: [
            {
              $: {
                state: string,
                reason: string,
                reason_ttl: string,
              },
            }
          ],
          service: [
            {
              $: {
                name: string,
                method: string,
                conf: string,
              },
            }
          ],
        },
        {
          $: {
            protocol: string,
            portid: string,
          },
          state: [
            {
              $: {
                state: string,
                reason: string,
                reason_ttl: string,
              },
            }
          ],
          service: [
            {
              $: {
                name: string,
                method: string,
                conf: string,
              },
            }
          ],
        },
        {
          $: {
            protocol: string,
            portid: string,
          },
          state: [
            {
              $: {
                state: string,
                reason: string,
                reason_ttl: string,
              },
            }
          ],
          service: [
            {
              $: {
                name: string,
                method: string,
                conf: string,
              },
            }
          ],
        },
        {
          $: {
            protocol: string,
            portid: string,
          },
          state: [
            {
              $: {
                state: string,
                reason: string,
                reason_ttl: string,
              },
            }
          ],
          service: [
            {
              $: {
                name: string,
                method: string,
                conf: string,
              },
            }
          ],
        }
      ],
    }
  ];
  times: [
    {
      $: {
        srtt: string,
        rttvar: string,
        to: string,
      },
    }
  ];
},
}
