/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/crowdfunding.json`.
 */
export type Crowdfunding = {
  "address": "8XFrTLrvNJCr3hG41vpxmK2BAHpTtPNVhKGHuxGu5NBb",
  "metadata": {
    "name": "crowdfunding",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "campaignOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "program_state.campaign_count",
                "account": "programState"
              }
            ]
          }
        },
        {
          "name": "programState"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignTitle",
          "type": "string"
        },
        {
          "name": "campaignDescription",
          "type": "string"
        },
        {
          "name": "campaignImageUrl",
          "type": "string"
        },
        {
          "name": "campaignGoalAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteCampaign",
      "discriminator": [
        223,
        105,
        48,
        131,
        88,
        27,
        249,
        227
      ],
      "accounts": [
        {
          "name": "campaignOwer",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "donate",
      "discriminator": [
        121,
        186,
        218,
        211,
        73,
        70,
        196,
        180
      ],
      "accounts": [
        {
          "name": "transactionOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "transaction",
          "writable": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignId",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateCampaign",
      "discriminator": [
        235,
        31,
        39,
        49,
        121,
        173,
        19,
        92
      ],
      "accounts": [
        {
          "name": "campaignOwer",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignId",
          "type": "u64"
        },
        {
          "name": "campaignTitle",
          "type": "string"
        },
        {
          "name": "campaignDescription",
          "type": "string"
        },
        {
          "name": "campaignImageUrl",
          "type": "string"
        },
        {
          "name": "campaignGoalAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePlatformState",
      "discriminator": [
        7,
        86,
        44,
        96,
        166,
        217,
        31,
        7
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "programState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "platformFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "withrawer",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "transaction",
          "writable": true
        },
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "platformAddress",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignId",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    },
    {
      "name": "transaction",
      "discriminator": [
        11,
        24,
        174,
        129,
        203,
        117,
        242,
        23
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "programAlreadyInitialized",
      "msg": "Program Already Initialized"
    },
    {
      "code": 6001,
      "name": "titleTooLongOrTooShort",
      "msg": "Campaign Title either too long or too short"
    },
    {
      "code": 6002,
      "name": "descriptionTooLongOrTooShort",
      "msg": "Campaign Description either too long or too short"
    },
    {
      "code": 6003,
      "name": "imageUrlTooLongOrTooShort",
      "msg": "Campaign Image URL either too long or too short"
    },
    {
      "code": 6004,
      "name": "invalidGoalAmount",
      "msg": "Invalid Goal Amount"
    },
    {
      "code": 6005,
      "name": "invalidCampaignId",
      "msg": "Invalid Campaign Id"
    },
    {
      "code": 6006,
      "name": "campaignAlreadyDeleted",
      "msg": "Campaign Already Deleted"
    },
    {
      "code": 6007,
      "name": "campaignNotActive",
      "msg": "Campaign Not Active"
    },
    {
      "code": 6008,
      "name": "invalidAmount",
      "msg": "Invalid Amount"
    },
    {
      "code": 6009,
      "name": "goalAmountReached",
      "msg": "Goal Amount Reached"
    },
    {
      "code": 6010,
      "name": "unAuthorizedWithdrawer",
      "msg": "UnAuthorized Withdrawer"
    },
    {
      "code": 6011,
      "name": "insufficientBalance",
      "msg": "Insufficient Balance"
    },
    {
      "code": 6012,
      "name": "invalidPlatformAddress",
      "msg": "Invalid Platform Address"
    },
    {
      "code": 6013,
      "name": "invalidPlatformFee",
      "msg": "Invalid Platform Fee"
    },
    {
      "code": 6014,
      "name": "unAuthorizedAccessForPlatformStateUpdate",
      "msg": "UnAuthorized Access For Platform State Update"
    },
    {
      "code": 6015,
      "name": "platformFeeAlreadyUpdated",
      "msg": "Platform Fee Already Updated"
    },
    {
      "code": 6016,
      "name": "programNotInitialized",
      "msg": "Program Not Initialized"
    },
    {
      "code": 6017,
      "name": "insufficientBalanceToCoverRent",
      "msg": "Insufficient Balance To Cover Rent"
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignId",
            "type": "u64"
          },
          {
            "name": "campaignOwer",
            "type": "pubkey"
          },
          {
            "name": "campaignTitle",
            "type": "string"
          },
          {
            "name": "campaignDescription",
            "type": "string"
          },
          {
            "name": "campaignImageUrl",
            "type": "string"
          },
          {
            "name": "campaignGoalAmount",
            "type": "u64"
          },
          {
            "name": "campaignRaisedAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "donorsCount",
            "type": "u64"
          },
          {
            "name": "withdrawalCount",
            "type": "u64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialize",
            "type": "bool"
          },
          {
            "name": "campaignCount",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "platformAddress",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignId",
            "type": "u64"
          },
          {
            "name": "transactionOwner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "isCredit",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
