const t = require("@babel/types");

const { generateExpressionNode, generateObjectProperty } = require("../utils");
const { generateStringType } = require("./generateStringType");
const { generateNumberType } = require("./generateNumberType");

const generateObjectType = (key, value, object) => {
  const required = value.required ?? false;
  const nullable = value.nullable ?? false;

  const objectSchema = t.objectExpression([]);
  let schema = t.callExpression(t.identifier("object"), [objectSchema]);

  for (const [innerKey, innerValue] of Object.entries(value)) {
    if (typeof innerValue === "object") {
      const type = innerValue.type;

      if (type === "integer" || type === "number") {
        const result = generateNumberType(innerKey, innerValue, object);

        objectSchema.properties.push(generateObjectProperty(innerKey, result));
      }

      if (type === "object") {
        const result = generateObjectType(innerKey, innerValue, object);
        objectSchema.properties.push(generateObjectProperty(innerKey, result));
      }
    }
  }

  if (required) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("required")), []);
  } else {
    schema = t.callExpression(
      t.memberExpression(schema, t.identifier("notRequired")),
      []
    );
  }

  if (nullable) {
    schema = t.callExpression(t.memberExpression(schema, t.identifier("nullable")), []);
  }

  return schema;

  // if (type === "string") {
  //   const result = generateStringType(key, value, object);
  //   schema.properties.push(generateObjectProperty(key, result));
  // }

  // if (type === "integer" || type === "number") {
  //   const result = generateNumberType(key, value, object);
  //   schema.properties.push(generateObjectProperty(key, result));
  // }

  // if (type === "boolean") {
  //   const result = generateBooleanType(key, value, object);
  //   schema.properties.push(generateObjectProperty(key, result));
  // }

  // let schema = generateExpressionNode("array(mixed().required()).required().default([])");

  // let schema = generateExpressionNode("object({}).shape().nullable()");

  //* OVERRIDE

  // return schema;
};

module.exports = {
  generateObjectType,
};
