const titleInput = document.getElementById("title");
const slugInput = document.getElementById("slug");

let slugManuallyEdited = false;

slugInput.addEventListener("input", () => {
    slugManuallyEdited = true;
});

titleInput.addEventListener("input", () => {
    if (slugManuallyEdited) return;

    let slug = titleInput.value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    slugInput.value = slug;
});
