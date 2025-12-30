import { db } from "../server/db";
import { organizationSettings } from "../shared/schema";

async function main() {
    console.log("🔍 Checking Settings...");

    try {
        const orgSettings = await db.select({ branding: organizationSettings.branding }).from(organizationSettings);
        console.log("🎨 Branding Config:", JSON.stringify(orgSettings[0]?.branding, null, 2));

        // specific table might be missing or named differently, checking schema first
        // Assuming platformSettingsTable exists based on context (or I'll check schema file first if this fails)
        // Wait, I should verify the schema file first to be sure about table names.

        // Let's just dump orgSettings for now as that's usually the main one for login branding
    } catch (e) {
        console.error("Error fetching settings:", e);
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
