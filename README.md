
## 🚀 About Project
Upload/Delete image to AWS S3 Buckets


## Tech Stack

Next JS , AWS-SDK


## Document

### AWS S3 Setup
- Block public access (bucket settings): uncheck all

- Bucket policy:
```ruby
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicListGet",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::BucketName",
                "arn:aws:s3:::BucketName/*"
            ]
        }
    ]
}
 ```

- Cross-origin resource sharing (CORS):
```ruby
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
 ```

- User Guide : https://docs.aws.amazon.com/AmazonS3/latest/userguide/delete-objects.html


## Example Image
![Alt text](https://drive.google.com/uc?export=view&id=117BFUcNDPRt9ZnBcOq2cXfBeP0aTGl7u)
