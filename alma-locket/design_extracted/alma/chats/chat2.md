# App Design Guidelines

_Started 2026-06-07 15:33 UTC_

---

## User

use lucid icons for this app. all icons to be min 16 pixels. on home make sure all elements are alligned on the left the same way (now they are not). for rituals, use these gradients. don't overuse purple, only for buttons. for play use grayscale to make it more premium. same for home navbar, no purple.

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: show_html]_

_[tool: grep]_

_[tool: grep]_

_[tool: list_files]_

_[tool: update_todos]_

_[tool: copy_files]_

_[tool: write_file]_

Now let me rewrite the files to address each fix. First, icons with Lucide path data:Now update data.jsx to use the uploaded images:

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: write_file]_

Now update Sanctuary for left alignment + image covers + cleaner tile presentation:

_[tool: str_replace_edit]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: write_file]_

Now let me build the morphing mandala. I'll rewrite mandala.jsx with 4 mandala variations that crossfade, and update the FullPlayer to use the artwork as a hero image:

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

I need to fix the mandala animation timing and add the keyframes. Let me update:

_[tool: str_replace_edit]_

Now add the `almaMorph` keyframe and bump mandala opacity in alma.css:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now update the FullPlayer backdrop so the artwork is a real hero image:

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: str_replace_edit]_

Let me make the hero artwork more visible — lighter overlays:

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: get_webview_logs]_

_[tool: eval_js_user_view]_

_[tool: str_replace_edit]_

Let me build this. First add new Lucide icons for the picker:

_[tool: str_replace_edit]_

Now add muted gradients + pin customization metadata to data.jsx:

_[tool: str_replace_edit]_

Add `PinOrb` helper + icon map to components.jsx:

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: write_file]_

Now create the customizer sheet:Now update Sanctuary — use PinOrb, add edit button, and add the "Add more" ritual card:

_[tool: str_replace_edit]_

Now update Vault to use PinOrb + edit button:

_[tool: str_replace_edit]_

Now wire up app.jsx to hold the customizer state + handlers:

_[tool: str_replace_edit]_

Now wire up pin-customizer.jsx in HTML:

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: get_webview_logs]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: screenshot_user_view]_

_[tool: str_replace_edit]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

