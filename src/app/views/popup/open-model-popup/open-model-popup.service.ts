import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenModelPopupService {



  constructor() { }

  getList() {
    return data;
  }
}

const data = [{
  lastUpdated: new Date(),
  name: 'Test Model 22', desc: 'Test Model 22 Description', nodes: [
    {
      "x": 293,
      "y": 160,
      "id": "JZJMJDCKEFBS3_1",
      "type": "INPUT",
      "displayLabel": "Input",
      "childrenId": [
        "JZJMJDXFW43XY_2"
      ],
      "equation": null,
      "defaultValue": null,
      "useGlobalValue": null,
      "globalValue": null
    },
    {
      "x": 427,
      "y": 274,
      "id": "JZJMJDXFW43XY_2",
      "type": "ACTION",
      "displayLabel": "Operation",
      "parentId": [
        "JZJMJDCKEFBS3_1"
      ],
      "equation": null,
      "defaultValue": null,
      "useGlobalValue": null,
      "globalValue": null
    }
  ]
},
{
  lastUpdated: new Date(),
  name: 'Test Model', desc: 'Test Model Description', nodes: [
    {
      "x": 60,
      "y": 124,
      "id": "JYSLWY51K9BO3_5",
      "type": "INPUT",
      "displayLabel": "% account with annual fee",
      "childrenId": [
        "JYSLV6TI9Z0F1_2"
      ]
    },
    {
      "x": 257,
      "y": 122,
      "id": "JYSLWZ251812F_6",
      "type": "INPUT",
      "displayLabel": "Average Annual fees",
      "childrenId": [
        "JYSLV7WEFTQK9_3"
      ]
    },
    {
      "x": 65,
      "y": 43,
      "id": "JYSLV5X3FKX74_1",
      "type": "ACTION",
      "displayLabel": "Average Accounts",
      "childrenId": [
        "JYSLV6TI9Z0F1_2"
      ]
    },
    {
      "x": 259,
      "y": 43,
      "id": "JYSLV6TI9Z0F1_2",
      "type": "ACTION",
      "displayLabel": "Account with annual fees",
      "childrenId": [
        "JYSLV7WEFTQK9_3"
      ],
      "parentId": [
        "JYSLWY51K9BO3_5",
        "JYSLV5X3FKX74_1"
      ]
    },
    {
      "x": 470,
      "y": 43,
      "id": "JYSLV7WEFTQK9_3",
      "type": "ACTION",
      "displayLabel": "Annual Fee before deferral",
      "childrenId": [
        "JYSLVAVYZCMSE_4"
      ],
      "parentId": [
        "JYSLWZ251812F_6",
        "JYSLV6TI9Z0F1_2"
      ],
      "equation": "(JYSLWZ251812F_6 + JYSLV6TI9Z0F1_2) / JYSLV6TI9Z0F1_2\n+ min(age)"
    },
    {
      "x": 652,
      "y": 43,
      "id": "JYSLVAVYZCMSE_4",
      "type": "OUTPUT",
      "displayLabel": "Annual Fees post-deferral",
      "parentId": [
        "JYSLX0TA4IY41_8",
        "JYSLX1PY8TCL5_9",
        "JYSLX2RXMAOK0_10",
        "JYSLV7WEFTQK9_3",
        "JYSLWZXQHBVI4_7"
      ],
      "equation": "(JYSLWZ251812F_6 + JYSLV6TI9Z0F1_2) / JYSLV6TI9Z0F1_2\n+ min(age)"
    },
    {
      "x": 471,
      "y": 321,
      "id": "JYSLX2RXMAOK0_10",
      "type": "INPUT",
      "displayLabel": "Packaging",
      "childrenId": [
        "JYSLVAVYZCMSE_4"
      ]
    },
    {
      "x": 471,
      "y": 253,
      "id": "JYSLX1PY8TCL5_9",
      "type": "INPUT",
      "displayLabel": "Promotions",
      "childrenId": [
        "JYSLVAVYZCMSE_4"
      ]
    },
    {
      "x": 471,
      "y": 120,
      "id": "JYSLWZXQHBVI4_7",
      "type": "INPUT",
      "displayLabel": "charge-back before defferal",
      "childrenId": [
        "JYSLVAVYZCMSE_4"
      ]
    },
    {
      "x": 471,
      "y": 187,
      "id": "JYSLX0TA4IY41_8",
      "type": "INPUT",
      "displayLabel": "Write-offs",
      "childrenId": [
        "JYSLVAVYZCMSE_4"
      ]
    }
  ]
}];
