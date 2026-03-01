import os
import re
from pathlib import Path

def read_migration_steps(instructions_file):
    """Reads migration steps from the instructions file."""
    steps = []
    with open(instructions_file, 'r', encoding='utf-8') as f:
        content = f.read()
        step_pattern = re.compile(r'Step\s+\d+:\s+(.*)')
        steps = step_pattern.findall(content)
    return steps

def generate_mermaid_diagram(steps):
    """Generates a Mermaid.js flowchart from the migration steps."""
    diagram = "graph TD;\n"
    for i, step in enumerate(steps, 1):
        diagram += f"    Step{i}([{step}])\n"
        if i > 1:
            diagram += f"    Step{i-1} --> Step{i}\n"
    return diagram

def generate_html_documentation(steps, diagram, output_file):
    """Generates an HTML documentation file with migration steps and Mermaid.js diagram."""
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Migration Documentation</title>
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      mermaid.initialize({{ startOnLoad: true }});
    </script>
</head>
<body>
    <h1>Project Migration Documentation</h1>
    <h2>Migration Steps</h2>
    <ol>
    """
    for step in steps:
        html_content += f"        <li>{step}</li>\n"
    html_content += """    </ol>
    <h2>Migration Workflow Diagram</h2>
    <div class="mermaid">
"""
    html_content += diagram
    html_content += """
    </div>
</body>
</html>"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

def generate_documentation():
    instructions_file = Path('project_instructions.md')
    if not instructions_file.exists():
        print(f"Instructions file '{instructions_file}' does not exist.")
        return

    steps = read_migration_steps(instructions_file)
    if not steps:
        print("No migration steps found in the instructions file.")
        return

    diagram = generate_mermaid_diagram(steps)
    analysis_folder = Path('analysis')
    analysis_folder.mkdir(exist_ok=True)
    output_file = analysis_folder / 'project_documentation.html'
    generate_html_documentation(steps, diagram, output_file)
    print(f"Project documentation generated at '{output_file}'.")

if __name__ == "__main__":
    generate_documentation()