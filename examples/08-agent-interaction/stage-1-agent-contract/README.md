# Stage 1: Agent Contract Files

This stage is the starting point of the full **Better Me Agent** exercise.

The idea of the class is to build the same agent in four layers:

1. **Stage 1: Contract**
   Define what the agent is in Markdown files.
2. **Stage 2: Runtime**
   Build a backend that reads those files, creates a prompt, calls the model, and saves logs.
3. **Stage 3: CopilotKit App**
   Wrap the runnable agent in a real CopilotKit-compatible backend and connect it to the UI so the user can chat with the agent, see the challenge, and track progress.
4. **Stage 4: Background Agent**
   Turn the runnable backend into a local assistant that can run on the system and send notifications proactively.

By separating the work like this, students can understand that an agent system is not only "an LLM call". It is a combination of:

- instructions
- task
- memory
- tools
- evaluation
- logging
- runtime
- UI

## Goal of Stage 1

In this phase, there is no backend and no frontend yet.

The goal is to define the **agent contract** as a group of Markdown files:

- `AGENTS.md`: the agent identity and behavioral rules
- `TASK.md`: what the agent must produce
- `MEMORY.md`: persistent user context
- `TOOLS.md`: what the agent can and cannot do
- `EVALS.md`: how to judge whether the output is good
- `RUN_LOG.md`: a place to store execution history later

## Folder

```txt
better-me-agent/
  agent/
    AGENTS.md
    TASK.md
    MEMORY.md
    TOOLS.md
    EVALS.md
    RUN_LOG.md
```

## Why this stage matters

This stage teaches an important idea: the agent behavior can be designed before writing code.

Instead of hardcoding everything in Python or JavaScript, we first write the contract in human-readable files. Later, the backend will read these files and turn them into a runnable agent.

## How to explore it

1. Open each file and read its role.
2. Compare `AGENTS.md` and `TASK.md`.
3. Look at `MEMORY.md` and predict how it should influence the answer.
4. Read `EVALS.md` and think about how you would check if an answer is acceptable.

## Simple test for students

Try changing one memory line, for example:

- change the user goal from sleep to exercise
- add a new preference like "User likes morning challenges"

Then ask:

- How should the next challenge change?
- How should the tone stay the same?
- Which rules must still be respected?

## What comes next

In **Stage 2**, these Markdown files stop being static notes and become real runtime input.

The backend will:

1. read all the files from `agent/`
2. combine them into one prompt
3. send that prompt to the model
4. return the final answer
5. append the run to `RUN_LOG.md`

In **Stage 3**, the runnable agent is wrapped in a real CopilotKit runtime and connected to the app-facing UI so the student can chat with the agent, see the daily challenge, and track progress.

In **Stage 4**, the same contract is reused again, but this time the agent runs in the background and sends local notifications, showing that an agent can become proactive instead of waiting for a chat message.

## What to learn

The key lesson of stage 1 is that the agent contract lives outside the code.  
The code comes later, but the behavior starts here.
