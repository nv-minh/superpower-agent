---
name: gsd:help
description: Compatibility shim routing legacy help requests to the FAD command surface.
---

<objective>
Preserve backward compatibility for users who still invoke `/gsd:help`.
</objective>

<process>
Explain that FAD is now the primary namespace and route the user to `/fad:help`.
If the project was installed with the full bundle, note that additional legacy GSD commands may also be available.
</process>
