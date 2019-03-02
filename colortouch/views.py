# coding=utf8
from django.forms import ModelForm
from django.shortcuts import render, HttpResponse
from .models import Informations, Pattern, Gallery, ContactForm as CF
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
# Create your views here.


class ContactForm(ModelForm):
    class Meta:
        model = CF
        fields = ['email', 'message']


def main_view(request):
    return render(request,'index.html',{'info': Informations.objects.first(),
                                        'pattern': Pattern.objects.all(),
                                        'galeria': Gallery.objects.all()
                                        }
                  )

def post_form_view(request):
    if request.method == 'POST' and request.POST:
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse('Dziękujemy za wiadomość.', status=200)
        else:
            ValidationError(_('Invalid value'), code='invalid')
            return HttpResponse('Nieprawidłowe dane.', status=400)
    else:
        return HttpResponse('Ups, coś poszło nietak.', status=400)