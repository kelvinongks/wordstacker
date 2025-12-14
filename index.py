import streamlit as st
from pathlib import Path

# Read HTML file
try:
    html_file = Path("index.html").read_text()
except FileNotFoundError:
    st.error("index.html not found. Make sure it is in the same folder as this script.")
    st.stop()

# Display HTML
st.components.v1.html(html_file, height=800)
