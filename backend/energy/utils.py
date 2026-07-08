import pandas as pd


def load_dataset(dataset):

    df = pd.read_csv(dataset.dataset_file.path)

    df["Date"] = pd.to_datetime(
        df["Date"],
        format="mixed",
        dayfirst=True
    )

    return df