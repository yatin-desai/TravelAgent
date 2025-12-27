from langgraph.graph import StateGraph, START
from langgraph.prebuilt import tools_condition
from state import AgentState
from nodes import call_model, tool_node

# 1. Initialize the Graph
workflow = StateGraph(AgentState)

# 2. Add the Nodes we imported from nodes.py
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)

# 3. Define the Flow
workflow.add_edge(START, "agent")

# This is the "Traffic Cop" logic
workflow.add_conditional_edges(
    "agent",
    tools_condition, 
)

# After tools finish, they always report back to the agent
workflow.add_edge("tools", "agent")

# 4. Compile the application
app = workflow.compile()

# 5. Test it!
if __name__ == "__main__":
    inputs = {"messages": [("user", "Find the cheapest flight from NYC to LON with at least a 2.5 hour layover")]}
    for output in app.stream(inputs):
        print(output)


from langgraph.checkpoint.memory import MemorySaver

# 1. Create the 'Memory' (Checkpointer)
memory = MemorySaver()

# 2. Compile the graph with two new settings:
# 'checkpointer' enables memory.
# 'interrupt_before' tells the graph where to pause.
app = workflow.compile(
    checkpointer=memory,
    interrupt_before=["tools"] # Pauses BEFORE the flight search tool runs
)

# Create a unique ID for this search session
config = {"configurable": {"thread_id": "traveler_001"}}

# Start the agent
inputs = {"messages": [("user", "Find a flight from JFK to LHR on Oct 1st")]}

# The agent will run until it hits the 'tools' node, then PAUSE.
for event in app.stream(inputs, config=config):
    print(event)

# At this point, the code will stop. 
# You can now inspect the state and choose to proceed.
user_approval = input("Agent wants to search for flights. Proceed? (y/n): ")

if user_approval.lower() == "y":
    # Resume by passing 'None' as the input, but keeping the same 'config'
    for event in app.stream(None, config=config):
        print(event)