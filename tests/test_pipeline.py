import unittest
from src.preprocessing import TextProcessor

class TestNLP(unittest.TestCase):
    def test_cleaning(self):
        tp = TextProcessor()
        sample = "Check this URL: http://google.com !!!"
        # Test if URL is removed and text is lowercase
        self.assertEqual(tp.clean_text(sample), "check this url")

if __name__ == "__main__":
    unittest.main()