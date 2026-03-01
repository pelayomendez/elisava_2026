import os
import re
from pathlib import Path

def extract_props(component_code):
    props_pattern = re.compile(r'props\.([A-Za-z0-9_]+)')
    props = props_pattern.findall(component_code)
    return list(set(props))

def extract_state(component_code):
    state_pattern = re.compile(r'this\.state\s*=\s*{([^}]+)}')
    state_match = state_pattern.search(component_code)
    if state_match:
        state = state_match.group(1).strip()
        return state.replace('\\n', '').replace(' ', '')
    return 'None'

def generate_html(component_name, props, state, dependencies, description=""):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>{component_name} Documentation</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h1 {{ color: #333; }}
            section {{ margin-bottom: 20px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }}
            th {{ background-color: #f2f2f2; }}
            code {{ background-color: #f9f9f9; padding: 2px 4px; border-radius: 4px; }}
        </style>
    </head>
    <body>
        <h1>{component_name} Component Documentation</h1>

        <section id="description">
            <h2>Description</h2>
            <p>{description}</p>
        </section>

        <section id="props">
            <h2>Props</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default Value</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {' '.join([f'<tr><td>{prop}</td><td>string</td><td>N/A</td><td>Description of {prop}</td></tr>' for prop in props])}
                </tbody>
            </table>
        </section>

        <section id="state">
            <h2>State</h2>
            <p>{state}</p>
        </section>

        <section id="dependencies">
            <h2>Dependencies</h2>
            <ul>
                {' '.join([f'<li>{dep}</li>' for dep in dependencies])}
            </ul>
        </section>

        <section id="usage-examples">
            <h2>Usage Examples</h2>
            <pre><code>import React from 'react';
import {component_name} from './{component_name}';

function App() {{
    return (
        <div>
            <{component_name} />
        </div>
    );
}}

export default App;
            </code></pre>
        </section>

        <section id="accessibility-considerations">
            <h2>Accessibility Considerations</h2>
            <p>Describe any accessibility features or considerations relevant to the {component_name} component.</p>
        </section>
    </body>
</html>
    """
    return html_content

def generate_documentation():
    src_folder = Path('react-origin-app/src')
    components_folder = Path('analysis/components')
    components_folder.mkdir(exist_ok=True)
    
    for file in src_folder.glob('*.js'):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            component_match = re.match(r'class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component', content)
            if component_match:
                component_name = component_match.group(1)
                props = extract_props(content)
                state = extract_state(content)
                dependencies = re.findall(r'import\s+([A-Za-z0-9_,\s{}]+)\s+from\s+[\'"]([^\'"]+)[\'"];', content)
                deps = [dep[1] for dep in dependencies]
                description = f"This component represents the {component_name} in the application."
                html = generate_html(component_name, props, state, deps, description)
                
                doc_file = components_folder / f'{component_name}.html'
                with open(doc_file, 'w', encoding='utf-8') as doc:
                    doc.write(html)
                print(f"Documentation for {component_name} generated at {doc_file}")

if __name__ == "__main__":
    generate_documentation()