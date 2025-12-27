import streamlit as st
from main import app # Import the graph you built earlier
import uuid

st.title("✈️ AI Travel Agent (2.5h Layover Rule)")

# 1. Initialize Session State for Chat and Thread ID
if "messages" not in st.session_state:
    st.session_state.messages = []
if "thread_id" not in st.session_state:
    st.session_state.thread_id = str(uuid.uuid4())

config = {"configurable": {"thread_id": st.session_state.thread_id}}

# 2. Display Chat History
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# 3. Handle User Input
if prompt := st.chat_input("Where do you want to go?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Invoke the Agent
    inputs = {"messages": [("user", prompt)]}
    for event in app.stream(inputs, config=config):
        # Check if the agent is paused at our 'tools' breakpoint
        if "__interrupt__" in event:
            st.session_state.waiting_for_approval = True
            st.info("Agent is ready to search flights. Please approve below.")
        else:
            # Display regular AI messages
            for value in event.values():
                content = value["messages"][-1].content
                st.session_state.messages.append({"role": "assistant", "content": content})
                with st.chat_message("assistant"):
                    st.markdown(content)

# 4. The HITL (Human-in-the-Loop) Button
if st.session_state.get("waiting_for_approval"):
    if st.button("✅ Approve Flight Search"):
        # Resume the graph with 'None' as input
        for event in app.stream(None, config=config):
            for value in event.values():
                content = value["messages"][-1].content
                with st.chat_message("assistant"):
                    st.write(content)
        st.session_state.waiting_for_approval = False