import pandas as pd
import numpy as np

# Load the CSV data into a DataFrame
df = pd.read_csv('./data_db.csv')

# Create the content for the init-mongo.js script
js_script = """
db = db.getSiblingDB('easysigaa');
db.createCollection('turmas');
"""

# Convert DataFrame to MongoDB insertMany format
insert_statements = []
for _, row in df.iterrows():
    row_dict = row.to_dict()
    # Remove NaN values
    row_dict = {key: (f'"{value}"' if isinstance(value, str) else value) for key, value in row_dict.items() if not pd.isna(value)}
    row_json = str(row_dict).replace("'", '"')
    insert_statements.append(f"  {row_json},")

# Remove the trailing comma and finalize the script
insert_statements_str = "\n".join(insert_statements).rstrip(',') + "\n"
js_script += f"""
db.turmas.insertMany([
{insert_statements_str}
]);
"""

# Write the script to a file
with open('./init-mongo.js', 'w') as f:
    f.write(js_script)

print("init-mongo.js script has been generated.")
