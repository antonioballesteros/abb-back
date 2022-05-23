# Abb - 2nd version - Back

Node + graphql + nexus + jest

## How to install it

### `npm install`

Sit and wait

## The correct way:
### Create database

#### `npm run init`
But this has a problem, the database it will be empty and the test will be a fail

## How to avoid it
### uncomment database with some data

#### `mv prisma/_db prisma/db`
It's not the best database, I've used to do tests, but al least has something to see


## Update graphql schema
### `npm run generate`

## How to run it

In the project directory, you can run:

### `npm run dev`

## How to test it

### `npm run test`


# Graphql queries and mutations

Playground can be opened from 

http://localhost:3100/


### get all the information from all parts, without filters

```
query {
  parts {
    id
    name
    layouts {
      id
      name
      size
      features {
        id
        name
        controls {
          id
          name
          order
          nominal
          dev1
          dev2
          value
          lasts
          quality
        }
      }
    }
  }
}
```
## Mutations

### create part
```
mutation  ($name: String!) {
  addPart(name: $name) {
    id
    name
    layouts {
      id
    }
  }
}
```
Variables
```
{
  "name": "Part name"
}
```
Result
```
{
  "data": {
    "addPart": {
      "id": "cl3il5q2q0030woxj95zsumyz",
      "name": "Part name",
      "layouts": []
    }
  }
}
```

### Create layout
```
mutation($name: String!, $size: Int!, $partId: String!) {
  addLayout(name: $name, size: $size, partId: $partId) {
    id
    name
    partId
    part {
      id
      name
    }
    features {
      id
      name
    }
  }
}
```
Variables
```
{
  "name": "layout1",
  "size":3,
  "partId":"cl3il5q2q0030woxj95zsumyz"
}
```
Result
```
{
  "data": {
    "addLayout": {
      "id": "cl3il8tn10039woxji21wn66g",
      "name": "layout1",
      "partId": "cl3il5q2q0030woxj95zsumyz",
      "part": {
        "id": "cl3il5q2q0030woxj95zsumyz",
        "name": "part name"
      },
      "features": []
    }
  }
}
```

### Create Feature
```
mutation($name: String!, $layoutId: String!) {
  addFeature(name: $name, layoutId: $layoutId) {
    id
    name
    layoutId
    layout {
      id
      name
      features {
        id
        name
      }
    }
    controls {
      id
      name
    }
  }
}
```
Variables
```
{
  "name": "feature1",
  "layoutId":"cl3il8tn10039woxji21wn66g"
}
```
Result
```
{
  "data": {
    "addFeature": {
      "id": "cl3ilb9dc0053woxjisndznyr",
      "name": "feature1",
      "layoutId": "cl3il8tn10039woxji21wn66g",
      "layout": {
        "id": "cl3il8tn10039woxji21wn66g",
        "name": "layout1",
        "features": [
          {
            "id": "cl3ilb9dc0053woxjisndznyr",
            "name": "feature1"
          }
        ]
      },
      "controls": []
    }
  }
}
```
### Create Control
```
mutation(
  $name: String!
  $dev1: Float!
  $dev2: Float!
  $nominal: Float!
  $featureId: String!
  $order: Int!
) {
  addControl(
    name: $name
    dev1: $dev1
    dev2: $dev2
    nominal: $nominal
    featureId: $featureId
    order: $order
  ) {
    id
    name
    quality
    featureId
    feature {
      id
      name
    }
  }
}
```
Variables
```
{
  "name": "Control1",
  "nominal":50,
  "dev1": 3,
  "dev2":5,
  "featureId":"cl3ilb9dc0053woxjisndznyr",
  "order":1
}
```
Result 
```
{
  "data": {
    "addControl": {
      "id": "cl3ild01v0070woxj5aga4t9r",
      "name": "control1",
      "quality": null,
      "featureId": "cl3ilb9dc0053woxjisndznyr",
      "feature": {
        "id": "cl3ilb9dc0053woxjisndznyr",
        "name": "feature1"
      }
    }
  }
}
```
### Add Value ( update )
```
mutation($id: String!, $value: Float) {
  addValue(id: $id, value: $value) {
    id
    name
    lasts
    value
    quality
    nominal
    dev1
    dev2
    featureId
    feature {
      id
      name
    }
  }
}
```
Variables
```
{
  "id": "cl3ild01v0070woxj5aga4t9r",
  "value": 50.5
}
```
Results 
```
{
  "data": {
    "addValue": {
      "id": "cl3ild01v0070woxj5aga4t9r",
      "name": "control1",
      "lasts": "[50.5]",
      "value": 50.5,
      "quality": "GOOD",
      "nominal": 50,
      "dev1": 3,
      "dev2": 5,
      "featureId": "cl3ilb9dc0053woxjisndznyr",
      "feature": {
        "id": "cl3ilb9dc0053woxjisndznyr",
        "name": "feature1"
      }
    }
  }
}
```

## Update values
With this mutation, you can send updates, changing the `value` to simulate new updates from external devices
Each mutation should update the frontend view ( if the correct part is displayed )