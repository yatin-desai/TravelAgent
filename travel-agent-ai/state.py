from typing import TypedDict, List, Annotated
import operator

class AgentState(TypedDict):
    # This must be exactly what the other files expect
    messages: Annotated[List[dict], operator.add]
    valid_flights: List[dict]
    search_complete: bool
