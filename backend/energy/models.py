from django.db import models
from django.conf import settings


class EnergyDataset(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="datasets"
    )

    dataset_name = models.CharField(max_length=200)

    dataset_file = models.FileField(
        upload_to="datasets/"
    )

    file_size = models.PositiveIntegerField(default=0)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.dataset_name