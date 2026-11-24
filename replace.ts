import fs from "fs";

const files = ["components/CoursesPage.tsx", "components/WebinarPage.tsx"];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/Timothy Ronald/g, "TR");
    fs.writeFileSync(file, content);
    console.log(`Replaced in ${file}`);
  }
}
