import streamlit as st
from pathlib import Path

# Clear cache (if needed)
if hasattr(st, "cache_data"):
    st.cache_data.clear()
if hasattr(st, "cache_resource"):
    st.cache_resource.clear()

# Read and display HTML
html_file = Path("index.html").read_text()
st.components.v1.html(html_file, height=800)
