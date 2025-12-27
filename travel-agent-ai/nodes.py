from langchain_openai import ChatOpenAI
from tools import search_flights_tool # This would wrap your layover logic

# 1. Initialize the "Brain"
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 2. Bind the tool so the LLM knows it exists
# This creates a special version of the LLM that can output "Tool Calls"
tools = [search_flights_tool]
llm_with_tools = llm.bind_tools(tools)

from langgraph.prebuilt import ToolNode

# This node calls the LLM
def call_model(state):
    messages = state["messages"]
    # The LLM decides if it needs a tool or can answer directly
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

# This pre-built node automatically runs the tool the LLM asked for
tool_node = ToolNode(tools)


from langchain_core.messages import SystemMessage

def call_model(state):
    # This is the 'Constitution' for your travel agent
    sys_msg = SystemMessage(content=(
        "You are a strict Travel Assistant. Your primary rule is to ensure "
        "layovers are at least 150 minutes (2.5 hours) for traveler comfort. "
        "1. Use the search tool to find flights. "
        "2. Only present flights that the tool has verified as valid. "
        "3. If multiple flights are valid, sort them by price (cheapest first). "
        "4. Always mention the specific layover duration in your response."
    ))
    
    messages = [sys_msg] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# 1. Load the .env file
load_dotenv()

# 2. Initialize the model 
# (It will automatically look for OPENAI_API_KEY in your environment)
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 3. Bind your flight tools (from previous steps)
# llm_with_tools = llm.bind_tools(tools)