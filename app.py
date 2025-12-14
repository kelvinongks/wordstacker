import streamlit as st
st.cache_data.clear()
st.cache_resource.clear()

html_file = Path("index.html").read_text()
st.components.v1.html(html_file, height=800)
