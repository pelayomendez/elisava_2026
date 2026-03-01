def list_migration_steps(file_path):
    steps = []
    with open(file_path, 'r') as file:
        lines = file.readlines()
        inside_step = False
        current_step = []
        for line in lines:
            strip_line = line.strip()
            if strip_line.startswith('# Step'):
                if current_step:
                    steps.append(' '.join(current_step).strip())
                    current_step = []
                inside_step = True
                current_step.append(strip_line)
            elif inside_step:
                if strip_line.startswith('##') or strip_line.startswith('###'):
                    # New section or subsection, stop the current step
                    inside_step = False
                    if current_step:
                        steps.append(' '.join(current_step).strip())
                        current_step = []
                else:
                    current_step.append(strip_line)
        # Add last step if any
        if current_step:
            steps.append(' '.join(current_step).strip())
    return steps


if __name__ == "__main__":
    # Example usage
    steps = list_migration_steps('project_instructions.md')
    for i, step in enumerate(steps, start=1):
        print(f"Step {i}: {step}\n")