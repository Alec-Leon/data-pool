const fs = require("fs");
const path = require("path");

module.exports = function() {
    const root = "data/enemies";
    const result = {
        mooks: [],
        lieutenants: [],
        bosses: []
    };

    const tiers = ["mooks", "lieutenants", "bosses"];

    tiers.forEach(tier => {
        const dir = path.join(root, tier);
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            if (file.endsWith(".json")) {
                const fullPath = path.join(dir, file);
                const json = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
                json.id = json.id || path.basename(file, ".json");
                result[tier].push(json);
            }
        });
    });

    return { enemies: result };
}