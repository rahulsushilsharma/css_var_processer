import { open, readFile, writeFile } from "fs/promises";
const print = console.log;
const inputFile = "sample.css";

function clean(data = "") {
  data = data.replaceAll("\n", " ");
  data = data.replaceAll("\r", " ");
  data = data.replaceAll('"', "'");
  data = data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
  return data;
}
function csvToJson(data = "") {
  let temp = data.split(";");
  for (let i = 0; i < temp.length; i++) {
    temp[i] = temp[i].split(":");
  }
  return data;
}
function cleanTokens(data) {
  data = data.replaceAll("\t", "");
  // data = data.replaceAll(" ", "");
  data = data.trim();
  return data;
}
function tocenize(data = "", type = "string") {
  data = clean(data);
  let i = 0;
  let key = "";
  let val = "";
  let op = {};
  let skip = 0;
  let meta = [];
  while (i < data.length) {
    let obj = {
      identifier: "",
      proprities: "",
    };
    if (data[i] == "{") {
      i++;
      skip = 1;
      val = "{";
      let flag = "";
      while (skip != 0) {
        if (skip > 1) {
          flag = "$";
          delete op[key];
        }
        if (data[i] == "{") skip++;
        if (data[i] == "}") skip--;
        val += data[i++];
      }
      val = cleanTokens(val);
      obj.proprities = val;

      op[flag + key] = csvToJson(val);
      key = "";
    } else {
      while (data[i] != "{" && i < data.length) {
        key += data[i++];
      }
      key = cleanTokens(key);
      obj.identifier = key;
      op[key] = "";
      val = "";
    }
    meta.push(obj);
  }

  // for (const key in op) {
  //   // print(key)
  //   if (key[0] == "$") {
  //     let data = op[key].substring(1, op[key].length - 1);
  //     delete op[key];

  //     let temp = tocenize(data);
  //     let i = 0;
  //     print(temp);
  //     temp.forEach((element) => {
  //       let k = key + i;
  //       // print(k,);
  //       op[k] = element;
  //       i++;
  //     });
  //   }
  // }
  writeFile("op1.json", JSON.stringify(meta));
  if (type == "string") return JSON.stringify(op);
  else return op;
}

async function main() {
  let data = await readFile(inputFile);
  let tokens = tocenize(data.toString());
  //   print(tokens);
  await writeFile("op.json", tokens);
  let d = JSON.parse(tokens);
  // d.forEach((ele) => print(e));
  for (const key in d) {
    if (Object.hasOwnProperty.call(d, key)) {
      const element = d[key];
      print(
        key,
        element
          .replaceAll(" ", "")
          .substring(1, d[key].length - 1)
          .split(";")
      );
    }
  }
  // print(d[]);
}

main();
