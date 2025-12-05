import { firebaseDB } from "./firebase-init.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

export async function firebaseWriteTest() {
    const testRef = ref(firebaseDB, "debug/testWrite");

    try {
        await set(testRef, {
            message: "Hello NSFW Dice Game",
            timestamp: Date.now()
        });
        console.log("Firebase test write OK");
    } catch (err) {
        console.error("Firebase test write error:", err);
    }
}
