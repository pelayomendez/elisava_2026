import subprocess
import sys
from pathlib import Path

def execute_step(script_path):
    try:
        subprocess.check_call([sys.executable, script_path])
        print(f"Successfully executed {script_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error executing {script_path}: {e}")
        sys.exit(1)

def main():
    tools_dir = Path('tools')
    migration_steps = [
        'list_migration_steps.py',
        'generate_project_documentation.py',
        'generate_component_docs.py',
        'generate_project_documentation.py'  # Add other scripts as necessary
    ]

    for step in migration_steps:
        script = tools_dir / step
        if script.exists():
            execute_step(script)
        else:
            print(f"Script {script} does not exist.")
            sys.exit(1)

    print("All migration steps executed successfully.")

if __name__ == "__main__":
    main()