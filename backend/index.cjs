import("./server.js")
  .then((app) => {
    console.log("Server loaded successfully");
  })
  .catch((err) => {
    console.error("Error loading server:", err);
  });
