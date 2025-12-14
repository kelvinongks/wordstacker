import streamlit as st
from pathlib import Path

html_file = Path("index.html").read_text()
st.components.v1.html(html_file, height=800)
