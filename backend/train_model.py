import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Better dataset (manually created realistic)
data = [
    # Legitimate
    [0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,2,0,1,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,0,1,0,0,1,1,1,0,0,0,0,0,0],

    # Phishing
    [1,1,1,5,1,0,1,1,0,0,0,1,1,1,1,1,1],
    [1,1,1,6,1,0,1,1,0,0,0,1,1,1,1,1,1],
    [1,1,1,7,1,0,1,1,0,0,0,1,1,1,1,1,1],
]

columns = [
    "Have_IP","Have_At","URL_Length","URL_Depth","Redirection",
    "https_Domain","Tiny_URL","Prefix/Suffix","DNS_Record",
    "Web_Traffic","Domain_Age","Domain_End","iFrame",
    "Mouse_Over","Right_Click","Web_Forwards","label"
]

df = pd.DataFrame(data, columns=columns)

X = df.drop("label", axis=1)
y = df["label"]

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("✅ Improved model trained!")