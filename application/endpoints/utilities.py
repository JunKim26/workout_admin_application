from decimal import Decimal

def convert_decimals_to_string(obj):
    """
    Inspired by
    https://stackoverflow.com/questions/31202956/json-typeerror-decimal34-3-is-not-json-serializable
    """
    if isinstance(obj, Decimal):
        return str(obj)
    raise TypeError("Object %s is not serializable by JSON" % type(obj).__name__)