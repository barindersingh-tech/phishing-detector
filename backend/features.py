import re
from urllib.parse import urlparse

def extract_features(url):
    features = {}

    parsed = urlparse(url)
    domain = parsed.netloc

    # 1. Have_IP
    features["Have_IP"] = 1 if re.match(r"\d+\.\d+\.\d+\.\d+", domain) else 0

    # 2. Have_At
    features["Have_At"] = 1 if "@" in url else 0

    # 3. URL_Length
    features["URL_Length"] = 1 if len(url) > 75 else 0

    # 4. URL_Depth
    features["URL_Depth"] = url.count('/')

    # 5. Redirection
    features["Redirection"] = 1 if "//" in url[7:] else 0

    # 6. https_Domain
    features["https_Domain"] = 1 if "https" in url else 0

    # 7. Tiny_URL
    shortening_services = r"bit\.ly|goo\.gl|tinyurl|ow\.ly|t\.co"
    features["Tiny_URL"] = 1 if re.search(shortening_services, url) else 0

    # 8. Prefix/Suffix
    features["Prefix/Suffix"] = 1 if "-" in domain else 0

    # 9. DNS_Record (basic assumption)
    features["DNS_Record"] = 0

    # 10. Web_Traffic (assume good sites have traffic)
    features["Web_Traffic"] = 1 if "google" in domain else 0

    # Remaining (default safe values)
    features["Domain_Age"] = 1
    features["Domain_End"] = 0
    features["iFrame"] = 0
    features["Mouse_Over"] = 0
    features["Right_Click"] = 0
    features["Web_Forwards"] = 0

    return features