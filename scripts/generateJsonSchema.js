const fs = require("node:fs");
const axios = require("axios");
const path = require("node:path");
const _lodash = require("lodash");
const t = require("@babel/types");
const _template = require("@babel/template");
const _generate = require("@babel/generator");
const { promisify } = require("node:util");
const { exec } = require("node:child_process");

const { get, set, omit, unset, filter } = _lodash;

const template = _template.default;
const generate = _generate.default;

const tempFile = path.resolve(__dirname, "_temp.txt");

if (!fs.existsSync(tempFile)) {
  throw new Error("_temp.txt doesn't exist!");
}

const GET_PATH = path.resolve(process.cwd(), "__generated__", "GET.ts");
const POST_PATH = path.resolve(process.cwd(), "__generated__", "POST.ts");
// const POST_TYPE_PATH = path.resolve(process.cwd(), "__generated__", "POST_TYPE.ts");
const PATCH_PATH = path.resolve(process.cwd(), "__generated__", "PATCH.ts");
// const PATCH_TYPE_PATH = path.resolve(process.cwd(), "__generated__", "PATCH_TYPE.ts");
const END_POINT_PATH = path.resolve(process.cwd(), "__generated__", "END_POINT.ts");

const GET_DEST = fs.createWriteStream(GET_PATH);
const POST_DEST = fs.createWriteStream(POST_PATH);
// const POST_TYPE_DEST = fs.createWriteStream(POST_TYPE_PATH);
const PATCH_DEST = fs.createWriteStream(PATCH_PATH);
// const PATH_TYPE_DEST = fs.createWriteStream(PATCH_TYPE_PATH);
const END_POINT_DEST = fs.createWriteStream(END_POINT_PATH, {});

const apiTemplate = template(`export const API_NAME = API_VALUE;`);

//* FOR VALIDATING INPUT DAT

const content = fs.readFileSync(tempFile, { encoding: "utf8" });

const jsonSchemaUrlList = JSON.parse(content);

const uniqNameListForEndPoint = new Set();
const uniqNameListForGet = new Set();
const uniqNameListForPost = new Set();
const uniqNameListForPatch = new Set();

Promise.all(
  jsonSchemaUrlList.map((el) =>
    axios.get(el).then(async ({ data: rootData }) => {
      const { paths, basePath } = rootData;

      for (const [pathName, data] of Object.entries(paths)) {
        const getObj = get(data, "get");
        const postObj = get(data, "post");
        const patchObj = get(data, "patch");

        if (!/{id}/g.test(pathName)) {
          const apiValue = `${basePath}${pathName}`;

          const apiKey = pathName
            .split("/")
            .filter((el) => el !== "")
            .map((el) =>
              el
                .split("-")
                .map((el) => el.toUpperCase())
                .join("_")
            )
            .join("_")
            .concat("_END_POINT");

          if (!uniqNameListForEndPoint.has(apiKey)) {
            const ast = apiTemplate({
              API_NAME: t.identifier(apiKey),
              API_VALUE: t.stringLiteral(apiValue),
            });

            END_POINT_DEST.write(`${generate(ast).code}\n\n`);

            uniqNameListForEndPoint.add(apiKey);
          }
        }

        if (getObj) {
          const parameters = get(getObj, "parameters");

          const { key, value } = buildSchema({
            path: pathName,
            parameters,
            suffix: "_GET_PARAM_SCHEMA",
            type: "query",
          });

          if (!uniqNameListForGet.has(key)) {
            GET_DEST.write(`export const ${key} = ${JSON.stringify(value)};\n`);

            uniqNameListForGet.add(key);
          }
        }

        if (postObj) {
          const parameters = get(postObj, "parameters");

          const { key, value } = buildSchema({
            path: pathName,
            parameters,
            suffix: "_POST_SCHEMA",
            rootData,
          });

          if (!uniqNameListForPost.has(key)) {
            POST_DEST.write(`export const ${key} = ${JSON.stringify(value)};\n`);

            uniqNameListForPost.add(key);
          }
        }

        if (patchObj) {
          const parameters = get(patchObj, "parameters");

          const { key, value } = buildSchema({
            path: pathName,
            parameters,
            suffix: "_PATCH_SCHEMA",
            rootData,
          });

          if (!uniqNameListForPatch.has(key)) {
            PATCH_DEST.write(`export const ${key} = ${JSON.stringify(value)};\n`);

            uniqNameListForPatch.add(key);
          }
        }
      }
    })
  )
)
  .then(async () => {
    [GET_DEST, POST_DEST, PATCH_DEST, END_POINT_DEST].map((el) => {
      el.end();
    });

    await Promise.all(
      [GET_PATH, POST_PATH, PATCH_PATH, END_POINT_PATH].map((el) => {
        return promisify(exec)(`npx prettier ${el} --write`);
      })
    );
  })
  .catch((err) => {
    console.log("🚀 ~ file: generateJsonSchema.js:139 ~ .then ~ err:", err);
  })
  .finally(() => {
    console.log("COMPLETELY GENERATE JSON SCHEMA");
  });

function buildSchema({
  path,
  parameters,
  prefix = "",
  suffix = "",
  type = "formData",
  rootData,
}) {
  const filteredParameters = filter(parameters, { in: type }).map((el) =>
    omit(el, ["in"])
  );

  const value = { type: "object", properties: {}, additionalProperties: false };

  filteredParameters.forEach((el) => {
    const { name, ...rest } = el;

    if ("x-nullable" in rest) {
      set(rest, `nullable`, get(rest, "x-nullable"));
      unset(rest, "x-nullable");
    }

    set(value, `properties.${name}`, rest);
  });

  //* Handling for type = body

  if (type === "formData") {
    const schemaList = filter(parameters, { in: "body" }).map((el) => el.schema);

    function traverseData(list, rootData, depth, prefix = "") {
      list.forEach((el) => {
        let requiredList;
        let propertiesObj;

        if ("$ref" in el) {
          const keyPath = el["$ref"].split("/").slice(2).join(".");
          const data = get(rootData.definitions, keyPath);

          requiredList = get(data, "required", []);
          propertiesObj = get(data, "properties");
        } else {
          requiredList = get(el, "required", []);
          propertiesObj = get(el, "properties");
        }

        for (const [key, data] of Object.entries(propertiesObj)) {
          if ("$ref" in data) {
            traverseData([data], rootData, depth + 1, key);

            const keyPath = data["$ref"].split("/").slice(2).join(".");
            const nestedData = get(rootData.definitions, keyPath);

            const type = get(nestedData, "type");
            const nullable = get(nestedData, "x-nullable", false);

            set(value, `properties.${key}.type`, type);

            set(value, `properties.${key}.nullable`, nullable);

            continue;
          }

          if ("x-nullable" in data) {
            set(data, `nullable`, get(data, "x-nullable"));
            unset(data, "x-nullable");
          }

          if (requiredList.includes(key)) {
            set(data, `required`, true);
          }

          if (!get(value, `properties.${[prefix, key].filter((el) => !!el).join(".")}`)) {
            set(
              value,
              `properties.${[prefix, key].filter((el) => !!el).join(".")}`,
              data
            );
          }
        }
      });
    }

    traverseData(schemaList, rootData, 0);
  }

  // !/^{.+}$/.test(el)
  const key = path
    .split("/")
    .map((el) => (/^{.+}$/.test(el) ? "WITH_ID" : el))
    .filter((el) => el !== "")
    .map((el) =>
      el
        .split("-")
        .map((el) => el.toUpperCase())
        .join("_")
    )
    .join("_")
    .concat(suffix);

  return {
    key,
    value,
  };
}

const buildTSType = (typeName, properties) => {
  //* _POST_SCHEMA || _PATCH_SCHEMA
  const _typeName = typeName.replace(/(_SCHEMA)/g, "_TYPE");

  const tsInterfaceBody = t.tsInterfaceBody([]);

  for (const [key, value] of Object.entries(properties)) {
    const type = value.type;
    const required = value.required;
    const nullable = value.nullable;
    const enumList = value.enum;

    if (type === "string") {
      let unionList = t.tsUnionType([t.tsStringKeyword()]);

      if (nullable) {
        unionList.types.push(t.tsNullKeyword());
      }

      if (enumList) {
        const _tempUnionList = t.tsUnionType([]);

        if (key === "country") {
          _tempUnionList.types.push(t.stringLiteral("VN"));
        } else if (key === "currency") {
          _tempUnionList.types.push(t.stringLiteral("VND"));
        } else {
          enumList.forEach((el) => {
            _tempUnionList.types.push(t.stringLiteral(el));
          });
        }

        unionList = _tempUnionList;
      }

      const propertySignature = t.tsPropertySignature(
        t.identifier(key),
        t.tsTypeAnnotation(unionList)
      );

      if (!required) {
        propertySignature.optional = true;
      }

      tsInterfaceBody.body.push(propertySignature);
    }

    if (type === "number" || type === "integer") {
      let unionList = t.tsUnionType([t.tsNumberKeyword()]);

      if (nullable) {
        unionList.types.push(t.tsNullKeyword());
      }

      const propertySignature = t.tsPropertySignature(
        t.identifier(key),
        t.tsTypeAnnotation(unionList)
      );

      if (!required) {
        propertySignature.optional = true;
      }

      tsInterfaceBody.body.push(propertySignature);
    }

    if (type === "boolean") {
      let unionList = t.tsUnionType([t.tsBooleanKeyword()]);

      if (nullable) {
        unionList.types.push(t.tsNullKeyword());
      }

      const propertySignature = t.tsPropertySignature(
        t.identifier(key),
        t.tsTypeAnnotation(unionList)
      );

      if (!required) {
        propertySignature.optional = true;
      }

      tsInterfaceBody.body.push(propertySignature);
    }

    if (type === "file") {
      let unionList = t.tsUnionType([t.tsAnyKeyword()]);

      if (nullable) {
        unionList.types.push(t.tsNullKeyword());
      }

      const propertySignature = t.tsPropertySignature(
        t.identifier(key),
        t.tsTypeAnnotation(unionList)
      );

      if (!required) {
        propertySignature.optional = true;
      }

      tsInterfaceBody.body.push(propertySignature);
    }

    if (type === "array") {
      const items = value.items.enum;
      const itemType = value.items.type;

      const tupleType = t.tsTupleType([]);

      if (items) {
        let unionList = t.tsUnionType([]);
        items.forEach((el) => {
          unionList.types.push(t.stringLiteral(el));
        });

        tupleType.elementTypes.push(unionList);
      } else {
        if (itemType === "string") {
          tupleType.elementTypes.push(t.tsStringKeyword());
        } else if ((itemType === "number") | (itemType === "integer")) {
          tupleType.elementTypes.push(t.tsNumberKeyword());
        }
      }

      const propertySignature = t.tsPropertySignature(
        t.identifier(key),
        t.tsTypeAnnotation(tupleType)
      );

      if (!required) {
        propertySignature.optional = true;
      }

      tsInterfaceBody.body.push(propertySignature);
    }
  }

  const tsInterfaceDeclaration = t.tsInterfaceDeclaration(
    t.identifier(_typeName),
    null,
    [],
    tsInterfaceBody
  );

  return generate(t.exportNamedDeclaration(tsInterfaceDeclaration)).code;

  //* string | number | integer | boolean | file | array
};
