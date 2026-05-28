import os
import sys
import types

# Ensure the root directory of the backend folder is in sys.path so we can import 'app' and other modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Ensure 'backend' imports work even when deployed with the 'backend' folder as the root directory on Vercel
if "backend" not in sys.modules:
    backend_module = types.ModuleType("backend")
    backend_module.__path__ = [parent_dir]
    sys.modules["backend"] = backend_module

# Import the Flask application instance from app.py
from app import app
